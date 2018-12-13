﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using BE.MainObjects;
using BE;
using BL;
using System.Collections.ObjectModel;
using System.Linq;
using System.Collections;



namespace PLWPF.Admin.ManageTester
{
    /// <summary>
    /// Add or update tester
    /// </summary>
    public partial class AddTester : Window
    {
        private Tester tester = new Tester();
        private IBL _blimp = FactoryBl.GetObject;
        //if it is an update
        private bool update = false;
        private ObservableCollection<BE.MainObjects.LessonsAndType> licenses = new ObservableCollection<LessonsAndType>();
        //all the errors
        private List<string> errorMessage = new List<string>();

        /// <summary>
        /// Add tester window
        /// </summary>
        /// <param name="id">tester id if it is an update</param>
        public AddTester(uint id = 0)
        {
            InitializeComponent();


            if (id == 0) {
                //bind the new tester to the window
                DataContext = tester;
                //set defualt falues
                tester.BirthDate = DateTime.Now.Date;
                tester.Schedule = new WeekSchedule();
            }
            else
            {
                try
                {
                    update = true;
                    //find the existing tester
                    tester = _blimp.AllTesters.First(x => x.Id == id);
                    //bind it
                    DataContext = tester;
                    //disable field that cant be changed
                    idTextBox.IsEnabled = false;
                    AllWeek.IsEnabled = false;
                    AllWeek.IsChecked = false;
                    DayWeek.IsEnabled = true;
                    //set the address
                    AddressTextBox.Text = (tester.Address!=null)? tester.Address.ToString():"";
                }
                catch
                {
                    Close();
                }
            }
            //set combox source
            genderComboBox.ItemsSource = Enum.GetValues(typeof(BE.Gender));
            Chooselicense.ItemsSource= Enum.GetValues(typeof(BE.LicenseType));
  
            //set day in week combox source
            var list = new List<DayOfWeek>();
            foreach (var item in (Enum.GetValues(typeof(DayOfWeek))))
                list.Add((DayOfWeek)item);
            DayWeek.ItemsSource = list.Take(5);
            DayWeek.SelectedItem = DayOfWeek.Sunday;

            //set hours combox
            var hours = new List<string>();
            for(int i = 0; i < 24; i++)
            {
                hours.Add(string.Format("{0:00}:00",i));
            }
            ChooseHours.ItemsSource = hours;
            DayWeek.SelectedItem = "All Days";

            //initilse licnse type learning
            if (tester.LicenseTypeTeaching == null) tester.LicenseTypeTeaching = new List<LicenseType>();
            if (update)
            {
                foreach (var item in tester.LicenseTypeTeaching)
                    Chooselicense.SelectedItems.Add(item);

            }
        }

        /// <summary>
        /// on id changed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void IdTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            //if id is correct the enable save
            try
            {
                if (BE.Tools.CheckID_IL(uint.Parse(idTextBox.Text)))
                    Save.IsEnabled = true;
                else
                    Save.IsEnabled = false;
            }
            catch
            {
                idTextBox.Text = "";
                Save.IsEnabled = false;
            }
        }

        /// <summary>
        /// update address
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void AddressTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            try
            {
                tester.Address = new BE.Routes.Address(AddressTextBox.Text);
            }
            catch
            {
                AddressTextBox.Text = "";
            }
        }

 
        /// <summary>
        /// On save clicked
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Save_Click(object sender, RoutedEventArgs e)
        {
            //update or save the tester
            try
            {
                tester.Address = new BE.Routes.Address(AddressTextBox.Text);
                if (update)
                    _blimp.UpdateTester(tester);
                else
                    _blimp.AddTester(tester);
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        /// <summary>
        /// when license selection changed update license list
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Chooselicense_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            tester.LicenseTypeTeaching = new List<LicenseType>();
            foreach(var item in Chooselicense.SelectedItems)
            {
                tester.LicenseTypeTeaching.Add((LicenseType)item);
            }
        }

        /// <summary>
        /// disable day of week combox
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void AllWeek_Checked(object sender, RoutedEventArgs e)
        {
            DayWeek.IsEnabled = false;
        }

        /// <summary>
        /// enable day of week combox
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void AllWeek_Unchecked(object sender, RoutedEventArgs e)
        {
            DayWeek.IsEnabled = true;
        }

        /// <summary>
        /// On Hours selection change
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ChooseHours_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            //update  hours in all days in week
            if (AllWeek.IsChecked == true)
            {
                foreach (var day in tester.Schedule.days)
                {
                    day.ClearHours();
                    foreach (var hour in ChooseHours.SelectedItems)
                        day.Hours[int.Parse(((string)hour).Substring(0,2))] = true;
                }
            }
            //update one day hours
            else
            {
                var day = tester.Schedule[(DayOfWeek)DayWeek.SelectedItem];
                day.ClearHours();
                foreach (var hour in ChooseHours.SelectedItems)
                    day.Hours[int.Parse(((string)hour).Substring(0, 2))] = true;
            }
        }

        /// <summary>
        /// update Day in week selection
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DayWeek_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var day = tester.Schedule[(DayOfWeek)DayWeek.SelectedItem];
            int i = 0;
            var list = new List<string>();
            foreach (var hour in day.Hours)
            {
                if (hour) list.Add(string.Format("{0:00}:00", i));
                i++;
            }
            ChooseHours.UnselectAll();
            foreach (var item in list)
            {
                ChooseHours.SelectedItems.Add(item);              
            }
        }

        /// <summary>
        /// When an error is thowed in data binding
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void validation_Error(object sender, ValidationErrorEventArgs e)
        {
            if (e.Action == ValidationErrorEventAction.Added) errorMessage.Add(e.Error.Exception.Message);
            else errorMessage.Remove(e.Error.Exception.Message);
            ErrorMessage.Text = "";
            foreach (var item in errorMessage)
            {
                ErrorMessage.Text += item + "\n";
            }
        }
    }
}
