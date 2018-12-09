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
using BL;

namespace PLWPF.Admin
{
    /// <summary>
    /// Interaction logic for Administrator.xaml
    /// </summary>
    public partial class Administrator : Window
    {
        private IBL bL = FactoryBl.GetObject;
        public Administrator()
        {
            InitializeComponent();
            ComboxUpdateTrainee.ItemsSource = bL.AllTrainee.Select(x => x.Id);
            ComboxRemoveTrainee.ItemsSource = bL.AllTrainee.Select(x => x.Id);
        }

        private void AddTrainee_Click(object sender, RoutedEventArgs e)
        {
            ManageTrainee.AddTrainee win = new ManageTrainee.AddTrainee();
            win.ShowDialog();
            ComboxUpdateTrainee.ItemsSource = bL.AllTrainee.Select(x => x.Id);
            ComboxRemoveTrainee.ItemsSource = bL.AllTrainee.Select(x => x.Id);
        }

        private void Updatetrainee_Click(object sender, RoutedEventArgs e)
        {
            try
            {

                ManageTrainee.AddTrainee win = new ManageTrainee.AddTrainee(uint.Parse(ComboxUpdateTrainee.SelectedItem.ToString()));
                win.ShowDialog();

            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void Removetrainee_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                bL.RemoveTrainee(bL.AllTrainee.First(x => x.Id == uint.Parse(ComboxRemoveTrainee.SelectedItem.ToString())));
                ComboxUpdateTrainee.ItemsSource = bL.AllTrainee.Select(x => x.Id);
                ComboxRemoveTrainee.ItemsSource = bL.AllTrainee.Select(x => x.Id);
            }
            catch { }
        }
    }
}
